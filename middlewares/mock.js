const https = require("https");
const fetch = require("node-fetch");
const url = require("url");
const fs = require("fs");
const path = require("path");
const { getConfig } = require("../config");

const saveRequest = dbService => (mockRequest = {}, newRequest) => {
  const _ = dbService.onRequests._;
  const attrsCompare = ["method", "url", "status"];
  if (
    _.isEqual(
      _.pick(mockRequest, attrsCompare),
      _.pick(newRequest, attrsCompare)
    )
  ) {
    return;
  }

  if (!_.isEmpty(mockRequest)) {
    newRequest.type = "custom";
  }

  dbService.onRequests.create(newRequest);
};

const transformResponse = async request => {
  let contentType = request.headers._headers["content-type"][0];
  if (contentType.includes("text/plain")) {
    return request.text();
  } else {
    return request.json();
  }
};

module.exports = ({ server, dbService }) => async (req, res, next) => {
  const saveRequestDb = saveRequest(dbService);
  const { uriApi: URI_API } = getConfig();
  const parsedUrl = url.parse(req.originalUrl.replace(/^\/proxy/, ""));
  const method = req.method;
  const uri = `http://${URI_API}${parsedUrl.path}`;
  let mockRequest = dbService.onRequests.getTo({ method, url: uri });

  if (!mockRequest) return
	
  let delay =  mockRequest.delay || 0;
	
	setTimeout(async () => {
		if (!server.locals.requestApi) {
			res.append("x-request-mock", "true");
	
			res.status(mockRequest.status);
			res.send(mockRequest.response);
			return;
		}
	
		const { authorization, "content-type": contentType = "" } = req.headers;
	
		try {
			let reqBody = req.body;
			if (contentType.includes("json")) {
				reqBody = JSON.stringify(reqBody);
			}
	
			if (contentType.includes("x-www-form-urlencoded")) {
				const form = new url.URLSearchParams();
				Object.keys(req.body).forEach(key => {
					form.append(key, req.body[key]);
				});
	
				reqBody = form;
			}
	
			const config = {
				method,
				body: reqBody,
				headers: {
					authorization,
					"content-type": contentType
				}
			};
	
			const request = await fetch(uri, config);
	
			if ([200, 400, 204].indexOf(request.status) === -1) {
				res.append("x-request-mock", "true");
	
				res.status(mockRequest.status);
				res.send(mockRequest.response);
				return;
			}
	
			res.set("Content-Type", "application/json");
	
			let response;
			try {
				response = await transformResponse(request);
			} catch (e) {
				console.log(e);
			}
	
			saveRequestDb(
				{ mockRequest },
				{
					type: "default",
					method,
					url: uri,
					status: request.status,
					response
				}
			);
	
			res.status(request.status);
			res.send(response);
		} catch (e) {
			console.log(e);
			res.status(500).json({ err: 1 });
		}
	}, delay)
};
