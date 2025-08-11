#!/usr/bin/env python3
"""
Comprehensive test to verify the date format fix
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

def create_test_transaction(token, amount, description, category_id, date_input):
    """Create a test transaction with specific date input"""
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "amount": str(amount),
        "description": description,
        "category": category_id,
        "transaction_type": "EXPENSE",
        "date": date_input
    }
    response = requests.post(f"{BASE_URL}/transactions/transactions/", json=data, headers=headers)
    if response.status_code == 201:
        return response.json()
    else:
        print(f"Failed to create transaction: {response.text}")
        return None

def get_transactions(token):
    """Get all transactions"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/transactions/transactions/", headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to get transactions: {response.text}")
        return None

def main():
    print("=== Testing Date Format Fix ===\n")
    
    # Login
    token = login()
    if not token:
        return
    
    print("1. Creating test transaction with DD-MM-YYYY format...")
    
    # Test with DD-MM-YYYY format (8th August, 2025)
    transaction = create_test_transaction(
        token, 
        150.00, 
        "Test DD-MM-YYYY format", 
        6,  # Food & Dining
        "08-09-2025"  # This should be interpreted as 8th August, 2025
    )
    
    if transaction:
        print(f"✓ Created transaction: {transaction['description']}")
        print(f"  Input date: 08-09-2025 (DD-MM-YYYY)")
        print(f"  Stored date: {transaction['date']}")
        
        # Verify the date is correct
        if transaction['date'] == "2025-08-09":
            print("  ✓ Date correctly interpreted as August 9th, 2025")
        else:
            print(f"  ✗ Date incorrectly interpreted as {transaction['date']}")
    else:
        print("Failed to create transaction")
        return
    
    print("\n2. Creating another test transaction...")
    
    # Test with another DD-MM-YYYY format (15th August, 2025)
    transaction2 = create_test_transaction(
        token, 
        200.00, 
        "Test DD-MM-YYYY format 2", 
        6,  # Food & Dining
        "15-08-2025"  # This should be interpreted as 15th August, 2025
    )
    
    if transaction2:
        print(f"✓ Created transaction: {transaction2['description']}")
        print(f"  Input date: 15-08-2025 (DD-MM-YYYY)")
        print(f"  Stored date: {transaction2['date']}")
        
        # Verify the date is correct
        if transaction2['date'] == "2025-08-15":
            print("  ✓ Date correctly interpreted as August 15th, 2025")
        else:
            print(f"  ✗ Date incorrectly interpreted as {transaction2['date']}")
    else:
        print("Failed to create transaction")
        return
    
    print("\n3. Testing budget analysis...")
    
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
            
        # Check if our test transactions are included
        test_transactions = [t for t in analysis['recent_transactions'] if 'Test DD-MM-YYYY' in t['description']]
        if test_transactions:
            print(f"\n  ✓ Found {len(test_transactions)} test transactions in budget analysis")
        else:
            print("\n  ✗ Test transactions not found in budget analysis")
    else:
        print(f"Failed to get budget analysis: {response.text}")
    
    print("\n=== Test Summary ===")
    print("Expected Results:")
    print("- Input: 08-09-2025 (DD-MM-YYYY) → Should be stored as 2025-08-09 (August 9th)")
    print("- Input: 15-08-2025 (DD-MM-YYYY) → Should be stored as 2025-08-15 (August 15th)")
    print("- Both transactions should appear in budget analysis")
    print("- Display should show 'Aug 9, 2025' and 'Aug 15, 2025'")
    
    print("\nIf the dates are stored and displayed correctly, the fix is working!")
    print("Go to your frontend and verify the transaction dates are correct.")

if __name__ == "__main__":
    main() 