#!/usr/bin/env python3
"""
Test script to verify date handling fix
"""

import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000/api"
USERNAME = "admin"  # Change to your username
PASSWORD = "admin"  # Change to your password

def login():
    """Login and get access token"""
    response = requests.post(f"{BASE_URL}/accounts/login/", {
        "username": USERNAME,
        "password": PASSWORD
    })
    if response.status_code == 200:
        return response.json()["access"]
    else:
        print(f"Login failed: {response.text}")
        return None

def create_test_transaction(token, amount, description, category_id, date):
    """Create a test transaction with specific date"""
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "amount": str(amount),
        "description": description,
        "category": category_id,
        "transaction_type": "EXPENSE",
        "date": date
    }
    response = requests.post(f"{BASE_URL}/transactions/transactions/", json=data, headers=headers)
    if response.status_code == 201:
        return response.json()
    else:
        print(f"Failed to create transaction: {response.text}")
        return None

def get_transactions(token):
    """Get all transactions to verify date handling"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/transactions/transactions/", headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to get transactions: {response.text}")
        return None

def main():
    print("=== Test Date Handling Fix ===\n")
    
    # Login
    token = login()
    if not token:
        return
    
    print("1. Creating test transactions with different date formats...")
    
    # Test with proper YYYY-MM-DD format
    transaction1 = create_test_transaction(
        token, 
        100.00, 
        "Test transaction 1 - YYYY-MM-DD", 
        6,  # Food & Dining
        "2025-08-15"
    )
    
    if transaction1:
        print(f"✓ Created transaction 1: {transaction1['description']} on {transaction1['date']}")
    else:
        print("Failed to create transaction 1")
        return
    
    # Test with another date in YYYY-MM-DD format
    transaction2 = create_test_transaction(
        token, 
        200.00, 
        "Test transaction 2 - YYYY-MM-DD", 
        6,  # Food & Dining
        "2025-08-20"
    )
    
    if transaction2:
        print(f"✓ Created transaction 2: {transaction2['description']} on {transaction2['date']}")
    else:
        print("Failed to create transaction 2")
        return
    
    print("\n2. Verifying transactions in database...")
    transactions = get_transactions(token)
    
    if transactions:
        print(f"✓ Found {len(transactions)} transactions")
        
        # Find our test transactions
        test_transactions = [t for t in transactions if 'Test transaction' in t['description']]
        
        print("\nTest transactions:")
        for transaction in test_transactions:
            print(f"  - {transaction['description']}: ${transaction['amount']} on {transaction['date']}")
            
        # Verify dates are in correct format
        for transaction in test_transactions:
            date_str = transaction['date']
            if len(date_str) == 10 and date_str.count('-') == 2:
                print(f"    ✓ Date format correct: {date_str}")
            else:
                print(f"    ✗ Date format incorrect: {date_str}")
    else:
        print("Failed to get transactions")
    
    print("\n3. Testing budget analysis with new transactions...")
    
    # Test Food & Dining budget (ID: 3)
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/budgets/budgets/3/spending_analysis/", headers=headers)
    
    if response.status_code == 200:
        analysis = response.json()
        print("✓ Budget Analysis Results:")
        print(f"  Budget: {analysis['budget']['name']}")
        print(f"  Period: {analysis['budget']['start_date']} to {analysis['budget']['end_date']}")
        print(f"  Total Spent: ${analysis['overall_progress']['total_spent']}")
        print(f"  Percentage Used: {analysis['overall_progress']['percentage_used']:.1f}%")
        
        print("\n  Recent Transactions:")
        for transaction in analysis['recent_transactions'][:5]:
            print(f"    - {transaction['description']}: ${transaction['amount']} on {transaction['date']}")
    else:
        print(f"Failed to get budget analysis: {response.text}")
    
    print("\n=== Date Handling Test Complete ===")
    print("If you see the test transactions with correct dates in the budget analysis,")
    print("then the date handling fix is working correctly!")
    print("\nGo to your frontend and check:")
    print("1. Transaction list shows correct dates")
    print("2. Budget page shows real spending data")
    print("3. Date picker works correctly")

if __name__ == "__main__":
    main() 