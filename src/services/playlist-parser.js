import { parseManifest } from "manifesto.js";

export function getAnnotationService(manifest) {
  const service = parseManifest(manifest).getService();
  if (service && service.getProperty('type') === 'AnnotationService0') {
    return service.id;
  } else {
    return null;
  }
}
