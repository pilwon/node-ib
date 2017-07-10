package com.ib.client;

public enum OrderConditionType {
	Price(1),
	Time(3),
	Margin(4),
	Execution(5),
	Volume(6),
	PercentChange(7);
	
	private int m_val;
	
	OrderConditionType(int v) {
		m_val = v;
	}
	
	public int val() {
		return m_val;
	}
	
	public static OrderConditionType fromInt(int n) {
		for (OrderConditionType i : OrderConditionType.values())
			if (i.val() == n)
				return i;
		
		throw new NumberFormatException();
	}
}