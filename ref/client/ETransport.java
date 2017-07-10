package com.ib.client;

import java.io.Closeable;
import java.io.IOException;

public interface ETransport extends Closeable {
	void send(EMessage msg) throws IOException;
}
