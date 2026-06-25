const  notFound = (req,res,next)=>{
	    const err = new Error(`Not Found- ${req.originalUrl}`)
	    res.status(404)
	    next(err)
	}
	
	const errorHandler = (err,req,res,next) => {
	    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
	    res.status(statusCode)
	    if (process.env.NODE_ENV !== 'test') {
	        console.error('API error', {
	            requestId: req.requestId,
	            method: req.method,
	            url: req.originalUrl,
	            statusCode,
	            message: err.message,
	        })
	    }
	    res.json({
	        message: err.message,
	        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
	        requestId: req.requestId,
	            })
	}
	export {notFound,errorHandler}
