package com.ib.client;

public class VolumeCondition extends ContractCondition {
	
	public static final OrderConditionType conditionType = OrderConditionType.Volume;
	
	protected VolumeCondition() { }
	
    @Override
	public String toString() {
		return toString(null);
	}

	@Override
	public String toString(ContractLookuper lookuper) {
		return super.toString(lookuper);
	}

	private int m_volume;

	public int volume() {
		return m_volume;
	}

	public void volume(int m_volume) {
		this.m_volume = m_volume;
	}

	@Override
	protected String valueToString() {
		return "" + m_volume;
	}

	@Override
	protected void valueFromString(String v) {
		m_volume = Integer.parseInt(v);
	}
	
}