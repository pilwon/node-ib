package com.ib.client;

public class PercentChangeCondition extends ContractCondition {

	public static final OrderConditionType conditionType = OrderConditionType.PercentChange;
	
	protected PercentChangeCondition() { }
	
	@Override
	public String toString(ContractLookuper lookuper) {
		return super.toString(lookuper);
	}

	@Override
	public String toString() {
		return toString(null);
	}

	private double m_changePercent = Double.MAX_VALUE;

	public double changePercent() {
		return m_changePercent;
	}

	public void changePercent(double m_changePercent) {
		this.m_changePercent = m_changePercent;
	}

	@Override
	protected String valueToString() {
		return "" + m_changePercent;
	}

	@Override
	protected void valueFromString(String v) {
		m_changePercent = Double.parseDouble(v);
	} 
	
}