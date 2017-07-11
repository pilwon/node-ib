package com.ib.client;

public class MarginCondition extends OperatorCondition {
	
	public static final OrderConditionType conditionType = OrderConditionType.Margin;
	
	protected MarginCondition() { }
	
	@Override
	public String toString() {		
		return "the margin cushion percent" + super.toString();
	}

	private int m_percent;

	public int percent() {
		return m_percent;
	}

	public void percent(int m_percent) {
		this.m_percent = m_percent;
	}

	@Override
	protected String valueToString() {
		return "" + m_percent;
	}

	@Override
	protected void valueFromString(String v) {
		m_percent = Integer.parseInt(v);
	}
	
}