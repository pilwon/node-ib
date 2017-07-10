package com.ib.client;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class EMessage {
	ByteArrayOutputStream m_buf;
	
	public EMessage(byte[] buf, int len) {
		m_buf = new ByteArrayOutputStream();
		
		m_buf.write(buf, 0, len);
	}
	
	public EMessage(Builder buf) throws IOException {
		m_buf = new ByteArrayOutputStream();
		
			buf.writeTo(new DataOutputStream(m_buf));
	}
	
	public InputStream getStream() {
		return new ByteArrayInputStream(m_buf.toByteArray());
	}
	
	public byte[] getRawData() {		
		return m_buf.toByteArray();
	}
}
