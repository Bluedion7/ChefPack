const axios = require('axios');
const logger = require('./logger');

class GoogleMapsService {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.geocodingApiKey = process.env.GOOGLE_MAPS_GEOCODING_API_KEY || this.apiKey;
    this.distanceMatrixApiKey = process.env.GOOGLE_MAPS_DISTANCE_MATRIX_API_KEY || this.apiKey;
    this.placesApiKey = process.env.GOOGLE_MAPS_PLACES_API_KEY || this.apiKey;
    
    this.baseUrl = 'https://maps.googleapis.com/maps/api';
  }

  /**
   * Geocode an address to get coordinates
   * @param {string} address - The address to geocode
   * @returns {Promise<{lat: number, lng: number, formattedAddress: string}>}
   */
  async geocodeAddress(address) {
    try {
      const response = await axios.get(`${this.baseUrl}/geocode/json`, {
        params: {
          address,
          key: this.geocodingApiKey
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Geocoding failed: ${response.data.status}`);
      }

      const result = response.data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
        placeId: result.place_id,
        addressComponents: result.address_components
      };
    } catch (error) {
      logger.error('Geocoding error:', error);
      throw error;
    }
  }

  /**
   * Reverse geocode coordinates to get address
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<{address: string, components: object}>}
   */
  async reverseGeocode(lat, lng) {
    try {
      const response = await axios.get(`${this.baseUrl}/geocode/json`, {
        params: {
          latlng: `${lat},${lng}`,
          key: this.geocodingApiKey
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Reverse geocoding failed: ${response.data.status}`);
      }

      const result = response.data.results[0];
      return {
        address: result.formatted_address,
        components: result.address_components,
        placeId: result.place_id
      };
    } catch (error) {
      logger.error('Reverse geocoding error:', error);
      throw error;
    }
  }

  /**
   * Calculate distance and duration between two points
   * @param {object} origin - {lat, lng} or address string
   * @param {object} destination - {lat, lng} or address string
   * @returns {Promise<{distance: {text: string, value: number}, duration: {text: string, value: number}}>}
   */
  async calculateDistance(origin, destination) {
    try {
      const originStr = typeof origin === 'string' ? origin : `${origin.lat},${origin.lng}`;
      const destStr = typeof destination === 'string' ? destination : `${destination.lat},${destination.lng}`;

      const response = await axios.get(`${this.baseUrl}/distancematrix/json`, {
        params: {
          origins: originStr,
          destinations: destStr,
          key: this.distanceMatrixApiKey,
          units: 'metric'
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Distance calculation failed: ${response.data.status}`);
      }

      const element = response.data.rows[0].elements[0];
      
      if (element.status !== 'OK') {
        throw new Error(`Distance element failed: ${element.status}`);
      }

      return {
        distance: element.distance, // {text: "10.5 km", value: 10500}
        duration: element.duration  // {text: "15 mins", value: 900}
      };
    } catch (error) {
      logger.error('Distance calculation error:', error);
      throw error;
    }
  }

  /**
   * Search for places near a location
   * @param {object} location - {lat, lng}
   * @param {number} radius - Search radius in meters
   * @param {string} type - Place type (e.g., 'restaurant', 'store')
   * @returns {Promise<Array>}
   */
  async searchNearby(location, radius = 5000, type = null) {
    try {
      const params = {
        location: `${location.lat},${location.lng}`,
        radius,
        key: this.placesApiKey
      };

      if (type) {
        params.type = type;
      }

      const response = await axios.get(`${this.baseUrl}/place/nearbysearch/json`, {
        params
      });

      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        throw new Error(`Place search failed: ${response.data.status}`);
      }

      return response.data.results;
    } catch (error) {
      logger.error('Place search error:', error);
      throw error;
    }
  }

  /**
   * Validate an address
   * @param {string} address - Address to validate
   * @returns {Promise<{valid: boolean, formatted: string, components: object}>}
   */
  async validateAddress(address) {
    try {
      const geocoded = await this.geocodeAddress(address);
      return {
        valid: true,
        formatted: geocoded.formattedAddress,
        components: geocoded.addressComponents,
        coordinates: {
          lat: geocoded.lat,
          lng: geocoded.lng
        }
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }
}

module.exports = new GoogleMapsService();

