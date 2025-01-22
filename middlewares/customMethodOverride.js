export default function customMethodOverride(req, res, next) {
    if (req.body && req.body._method) {
        req.method = req.body._method.toUpperCase(); // Override HTTP method
    }
    next();
}
