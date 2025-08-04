import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PactmanClientMock {
  private readonly logger = new Logger(PactmanClientMock.name);
  private readonly baseUrl = process.env.PACTMAN_BASE_URL;
  private readonly apiKey = process.env.PACTMAN_API_KEY;

  async search(input: {
    ein?: string;
    organizationName?: string;
  }): Promise<any> {
    const { ein, organizationName } = input;

    if (!ein && !organizationName) {
      throw new Error('EIN or organization name must be provided');
    }

    // MOCK MODE: return mock data for now
    this.logger.warn(
      'Mocking PactmanClient.search() response. No real API call made.',
    );

    if (ein) {
      return {
        ein,
        name: 'Mocked Nonprofit Org',
        address: {
          street: '123 Charity Ave',
          city: 'Springfield',
          state: 'IL',
          zip: '62704',
        },
        mission: 'To support testing of nonprofit mock data.',
        website: 'https://mocked-nonprofit.org',
        status: 'Active',
      };
    }

    if (organizationName) {
      return [
        {
          ein: '123456789',
          name: `${organizationName} Foundation`,
          address: {
            street: '456 Community Blvd',
            city: 'Atlanta',
            state: 'GA',
            zip: '30303',
          },
          mission: 'Mock mission statement',
          website: 'https://example.org',
          status: 'Active',
        },
        {
          ein: '987654321',
          name: `${organizationName} Alliance`,
          address: {
            street: '789 Justice Lane',
            city: 'Austin',
            state: 'TX',
            zip: '73301',
          },
          mission: 'Another mock mission',
          website: 'https://mockdata.org',
          status: 'Inactive',
        },
      ];
    }

    return null;
  }
}
