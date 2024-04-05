const message_types = {
  200: "Success",
  400: "Bad request",
  401: "Unauthorized",
  403: "Access denied.",
  404: "Not found",
  "*": "Unexpected Error"
};

const send = (res, status_code, content = null) => {
  const message = message_types[status_code] || message_types["*"];
  return res.status(status_code).json({
    message: message,
    status_code: status_code,
    content: content
  });
}

module.exports = send;
