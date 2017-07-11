package com.ib.client;

public class BitMask {

    private int m_mask = 0;
    
    public BitMask(int mask) {
    	m_mask = mask;
    }
    
    public int getMask() {
        return m_mask;
    }

    public void clear() {
        m_mask = 0;
    }

    public boolean get(int index) {
        if (index >= 32) {
            throw new IndexOutOfBoundsException();
        }
        
        return (m_mask & (1 << index)) != 0;
    }

    public boolean set(int index, boolean element) {
        boolean res = get(index);
        
        if (element) {
            m_mask |= 1 << index;
        } else {
            m_mask &= ~(1 << index);
        }
        
        return res;
    }

}
