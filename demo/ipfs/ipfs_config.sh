#!/usr/bin/env bash
/sbin/tini -- /usr/local/bin/start_ipfs init
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
ipfs config show
ipfs daemon --migrate=true
