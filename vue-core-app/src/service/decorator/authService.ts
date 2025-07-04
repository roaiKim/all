import { viewType } from "@/type"

export function title(title: string, type: keyof typeof viewType = "view") {
  return (target, propertyKey, descriptor) => {
    descriptor.value!.__auth_description = title
    descriptor.value!.__auth_type = type
    descriptor.value!.__auth_key = `${target.name}_${propertyKey}`
    return descriptor
  }
}
