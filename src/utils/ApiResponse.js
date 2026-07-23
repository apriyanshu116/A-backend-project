class ApiResponse {
    constructor(statusCode,DataTransfer,message = "success"){
        this.statusCode = statusCode
        this.data = message
        this.success = statusCode < 400
    }
}