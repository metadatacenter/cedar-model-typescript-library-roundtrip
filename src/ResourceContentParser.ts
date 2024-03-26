export class ResourceContentParser {
  static parseContentJson(content: string): any {
    const jsonObj = JSON.parse(content);
    delete jsonObj['_id']; // Remove the top-level _id node of the MongoDB export
    return jsonObj;
  }
}
