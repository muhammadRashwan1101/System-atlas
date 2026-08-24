import api from "../api/axios";

/**
 * Service layer for project-scoped Graph Explorer API operations.
 */
export const graphService = {
  /**
   * Fetches all components for a specific project.
   * @param {string} projectId - Authoritative project ID from URL
   * @returns {Promise<Array>} Array of raw backend component objects
   */
  async getProjectComponents(projectId) {
    if (!projectId) {
      throw new Error("Project ID is required to fetch graph components.");
    }

    try {
      const response = await api.get(`/projects/${projectId}/components`);
      const list =
        response.data?.components ||
        response.data?.data ||
        response.data ||
        [];
      return Array.isArray(list) ? list : [];
    } catch (err) {
      if (err.response?.status === 404) {
        return [];
      }
      throw err;
    }
  },

  /**
   * Fetches all relationships for a specific project.
   * @param {string} projectId - Authoritative project ID from URL
   * @returns {Promise<Array>} Array of relationship objects
   */
  async getProjectRelationships(projectId) {
    if (!projectId) {
      throw new Error("Project ID is required to fetch relationships.");
    }

    try {
      const response = await api.get(`/projects/${projectId}/relationships`);
      const list =
        response.data?.relationships ||
        response.data?.data ||
        response.data ||
        [];
      return Array.isArray(list) ? list : [];
    } catch (err) {
      if (err.response?.status === 404) {
        return [];
      }
      throw err;
    }
  },

  /**
   * Fetches both components and relationships in parallel for the project graph.
   * @param {string} projectId - Authoritative project ID from URL
   * @returns {Promise<{ components: Array, relationships: Array }>}
   */
  async getProjectGraph(projectId) {
    if (!projectId) {
      throw new Error("Project ID is required to fetch graph data.");
    }

    const [components, relationships] = await Promise.all([
      this.getProjectComponents(projectId),
      this.getProjectRelationships(projectId),
    ]);

    return { components, relationships };
  },

  /**
   * Creates a new relationship between two components in a project.
   * Endpoint: POST /api/projects/:projectId/relationships
   * Body: { sourceId, targetId, type, protocol }
   *
   * @param {string} projectId - Authoritative project ID from URL
   * @param {Object} payload - { sourceId, targetId, type, protocol }
   * @returns {Promise<Object>} Created relationship record
   */
  async addRelationship(projectId, { sourceId, targetId, type, protocol }) {
    if (!projectId || !sourceId || !targetId) {
      throw new Error("Project ID, source ID, and target ID are required.");
    }

    const response = await api.post(`/projects/${projectId}/relationships`, {
      sourceId,
      targetId,
      type: type || "depends-on",
      protocol: protocol || "HTTPS",
    });

    return response.data;
  },

  /**
   * Updates an existing relationship by its ID.
   * Endpoint: PATCH /api/projects/:projectId/relationships/:relationshipId
   * Body: { type, protocol }
   *
   * @param {string} projectId - Authoritative project ID from URL
   * @param {string} relationshipId - ID of the relationship document
   * @param {Object} payload - { type, protocol }
   * @returns {Promise<Object>} Updated relationship record
   */
  async updateRelationship(projectId, relationshipId, { type, protocol }) {
    if (!projectId || !relationshipId) {
      throw new Error("Project ID and relationship ID are required.");
    }

    const response = await api.patch(
      `/projects/${projectId}/relationships/${relationshipId}`,
      {
        type,
        protocol,
      }
    );

    return response.data;
  },

  /**
   * Deletes an existing relationship by its ID.
   * Endpoint: DELETE /api/projects/:projectId/relationships/:relationshipId
   *
   * @param {string} projectId - Authoritative project ID from URL
   * @param {string} relationshipId - ID of the relationship document
   * @returns {Promise<Object>} Backend response
   */
  async removeRelationship(projectId, relationshipId) {
    if (!projectId || !relationshipId) {
      throw new Error("Project ID and relationship ID are required.");
    }

    const response = await api.delete(
      `/projects/${projectId}/relationships/${relationshipId}`
    );

    return response.data;
  },
};

export default graphService;
