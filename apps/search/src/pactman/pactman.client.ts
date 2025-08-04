import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PactmanClient {
  private readonly logger = new Logger(PactmanClient.name);
  private readonly baseUrl = process.env.PACTMAN_BASE_URL; // e.g. 'https://entities.pactman.org/'
  private readonly apiKey = process.env.PACTMAN_API_KEY;

  async search(input: {
    ein?: string;
    organizationName?: string;
  }): Promise<any> {
    const { ein, organizationName } = input;
    if (!ein && !organizationName) {
      throw new Error('EIN or organization name must be provided');
    }

    let url = `${this.baseUrl}`;

    if (ein) {
      url += `api/entities/nonprofitcheck/v1/us/ein/${ein}`;
    } else if (organizationName) {
      url += `api/entities/nonprofitcheck/lookup`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: 'application/json',
        },
      });

      const result = response.data;

      if (!result || (Array.isArray(result) && result.length === 0)) {
        return null;
      }

      return result;
    } catch (error: any) {
      this.logger.error('Error calling Pactman API:', error?.message);
      if (axios.isAxiosError(error)) {
        throw new Error(
          `API request failed: ${error.response?.status} - ${error.response?.data?.message}`,
        );
      }
      throw new Error('Failed to fetch data from Pactman API');
    }
  }
}
