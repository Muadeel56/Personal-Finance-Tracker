#!/usr/bin/env python3
"""
Test script to add a transaction within the budget period to verify the system works
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

def create_transaction(token, amount, description, category_id, date):
    """Create a transaction"""
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

def get_budget_analysis(token, budget_id):
    """Get budget spending analysis"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/budgets/budgets/{budget_id}/spending_analysis/", headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to get budget analysis: {response.text}")
        return None

def main():
    print("=== Test User Data ===\n")
    
    # Login
    token = login()
    if not token:
        return
    
    # Add a transaction within the Food & Dining budget period
    # Budget period: 2025-08-10 to 2025-09-10
    # Category ID: 6 (Food & Dining)
    print("Adding a transaction within the budget period...")
    
    # Create transaction on 2025-08-15 (within budget period)
    transaction = create_transaction(
        token, 
        1500.00, 
        "Weekend groceries", 
        6,  # Food & Dining category
        "2025-08-15"
    )
    
    if transaction:
        print(f"✓ Created transaction: {transaction['description']} (${transaction['amount']}) on {transaction['date']}")
        
        # Now check the budget analysis
        print("\nChecking budget analysis...")
        analysis = get_budget_analysis(token, 3)  # Food & Dining budget ID
        
        if analysis:
            print("✓ Budget Analysis Results:")
            print(f"  Budget: {analysis['budget']['name']}")
            print(f"  Period: {analysis['budget']['start_date']} to {analysis['budget']['end_date']}")
            print(f"  Total Budgeted: ${analysis['overall_progress']['total_budgeted']}")
            print(f"  Total Spent: ${analysis['overall_progress']['total_spent']}")
            print(f"  Percentage Used: {analysis['overall_progress']['percentage_used']:.1f}%")
            
            print("\n  Category Breakdown:")
            for category in analysis['category_breakdown']:
                print(f"    - {category['category_name']}: ${category['spent_amount']}/${category['budgeted_amount']} ({category['percentage_used']:.1f}%)")
            
            print(f"\n  Recent Transactions ({len(analysis['recent_transactions'])}):")
            for transaction in analysis['recent_transactions']:
                print(f"    - {transaction['description']}: ${transaction['amount']} ({transaction['category']['name']}) on {transaction['date']}")
        else:
            print("Failed to get budget analysis")
    else:
        print("Failed to create transaction")

if __name__ == "__main__":
    main() 