import { JsonNode } from 'cedar-model-typescript-library';

export class ResourceContentParser {
  static parseContentJson(content: string): JsonNode {
    const jsonObj = JSON.parse(content);
    delete jsonObj['_id']; // Remove the top-level _id node of the MongoDB export
    return jsonObj;
  }
}
