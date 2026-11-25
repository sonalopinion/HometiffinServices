export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = {};
    for (const issue of result.error.issues) {
      errors[issue.path.join(".") || "_"] ??= issue.message;
    }
    return res.status(400).json({ error: "Validation failed.", errors });
  }
  req.body = result.data;
  next();
};

// Wrap async handlers so rejected promises reach the error handler (Express 4).
export const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
