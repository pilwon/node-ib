package com.ib.client;

interface EClientMsgSink {
	void serverVersion(int version, String time);
	void redirect(String host);
}
