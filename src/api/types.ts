export interface Request {
  url: string
  method: string
  headers?: any
  params?: object
  data?: object
  onUploadProgress?: any
  isFormData?: boolean
}
