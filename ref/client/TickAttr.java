/* Copyright (C) 2013 Interactive Brokers LLC. All rights reserved.  This code is subject to the terms
 * and conditions of the IB API Non-Commercial License or the IB API Commercial License, as applicable. */

package com.ib.client;

public class TickAttr {
	private boolean m_canAutoExecute = false;
	private boolean m_pastLimit = false;
	
	public boolean canAutoExecute() {
		return m_canAutoExecute;
	}
	public boolean pastLimit() {
		return m_pastLimit;
	}
	public void canAutoExecute(boolean canAutoExecute) {
		this.m_canAutoExecute = canAutoExecute;
	}
	public void pastLimit(boolean pastLimit) {
		this.m_pastLimit = pastLimit;
	}
}
