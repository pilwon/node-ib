package com.ib.client;

public class PriceIncrement {
	private double m_lowEdge;
	private double m_increment;
	
	// Get
	public double lowEdge() { return m_lowEdge; }
	public double increment() { return m_increment; }
	
	// Set
	public void lowEdge(double lowEdge) { m_lowEdge = lowEdge; }
	public void increment(double increment) { m_increment = increment; }
	
	public PriceIncrement() {
	}
	
	public PriceIncrement(double p_lowEdge, double p_increment) {
		m_lowEdge = p_lowEdge;
		m_increment = p_increment;
	}
}
