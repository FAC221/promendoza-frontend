// services/metamapService.js

import { API_ENDPOINTS } from '../constants/metamap';

class MetaMapService {
  static async generateTempRegister() {
    const response = await fetch(API_ENDPOINTS.TEMP_REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }

  static async getMetaMapToken(userId) {
    const response = await fetch(API_ENDPOINTS.METAMAP_TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  }

  static async verifyIdentity(userId, identityId) {
    const response = await fetch(API_ENDPOINTS.VERIFY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, identityId }),
    });
    return response.json();
  }

  static async completeRegister(tempUserId, identityId) {
    const response = await fetch(API_ENDPOINTS.COMPLETE_REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tempUserId, identityId }),
    });
    return response.json();
  }
}

export default MetaMapService;