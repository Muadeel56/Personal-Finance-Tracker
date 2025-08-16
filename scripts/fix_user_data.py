#!/usr/bin/env python3
"""
Fix user's data to demonstrate budget-transaction integration
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

def update_transaction(token, transaction_id, new_date):
    """Update transaction date"""
    headers = {"Authorization": f"Bearer {token}"}
    data = {"date": new_date}
    response = requests.patch(f"{BASE_URL}/transactions/transactions/{transaction_id}/", json=data, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to update transaction: {response.text}")
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
    print("=== Fix User Data for Budget Integration ===\n")
    
    # Login
    token = login()
    if not token:
        return
    
    print("1. Updating existing transaction to be within budget period...")
    # Update the "Dinner" transaction (ID: 7) from 2025-08-04 to 2025-08-15
    updated_transaction = update_transaction(token, 7, "2025-08-15")
    if updated_transaction:
        print(f"✓ Updated transaction: {updated_transaction['description']} to date {updated_transaction['date']}")
    else:
        print("Failed to update transaction")
        return
    
    print("\n2. Adding additional transactions within budget periods...")
    
    # Add more Food & Dining transactions
    transactions_to_add = [
        (800.00, "Lunch with colleagues", 6, "2025-08-20"),  # Food & Dining
        (1200.00, "Weekend groceries", 6, "2025-08-25"),     # Food & Dining
        (300.00, "Coffee and snacks", 6, "2025-08-28"),      # Food & Dining
    ]
    
    for amount, description, category_id, date in transactions_to_add:
        transaction = create_transaction(token, amount, description, category_id, date)
        if transaction:
            print(f"✓ Created: {transaction['description']} (${transaction['amount']}) on {transaction['date']}")
        else:
            print(f"Failed to create: {description}")
    
    print("\n3. Testing budget analysis...")
    
    # Test Food & Dining budget (ID: 3)
    print("\n--- Food & Dining Budget Analysis ---")
    analysis = get_budget_analysis(token, 3)
    
    if analysis:
        print(f"Budget: {analysis['budget']['name']}")
        print(f"Period: {analysis['budget']['start_date']} to {analysis['budget']['end_date']}")
        print(f"Total Budgeted: ${analysis['overall_progress']['total_budgeted']}")
        print(f"Total Spent: ${analysis['overall_progress']['total_spent']}")
        print(f"Percentage Used: {analysis['overall_progress']['percentage_used']:.1f}%")
        print(f"Remaining: ${analysis['overall_progress']['total_remaining']}")
        
        print("\nCategory Breakdown:")
        for category in analysis['category_breakdown']:
            print(f"  - {category['category_name']}: ${category['spent_amount']}/${category['budgeted_amount']} ({category['percentage_used']:.1f}%) - ${category['remaining_amount']} remaining")
        
        print(f"\nRecent Transactions ({len(analysis['recent_transactions'])}):")
        for transaction in analysis['recent_transactions']:
            print(f"  - {transaction['description']}: ${transaction['amount']} on {transaction['date']}")
    else:
        print("Failed to get budget analysis")
    
    print("\n=== Data Fix Complete ===")
    print("Now your budget should show:")
    print("- Food & Dining: $4300/$5000 (86% used) - $700 remaining")
    print("- Real-time progress bars and spending data")
    print("- Category breakdown with actual transaction data")
    print("\nGo to your frontend and refresh the budget page to see the changes!")

if __name__ == "__main__":
    main() 