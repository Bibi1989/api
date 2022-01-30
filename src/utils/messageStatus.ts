export const successMessage = (res: any, data: any) => {
  res.json({status: "success", data})
}

export const errorMessage = (res: any, message: any, statusCode: number) => {
  return res.status(statusCode).json({status: "error", error: message})
}