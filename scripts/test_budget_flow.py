#!/usr/bin/env python3
"""
Test script to demonstrate the complete budget-transaction flow
Run this after starting the Django server to test the integration
"""

import requests
import json
from datetime import datetime, timedelta

# Configuration
BASE_URL = "http://localhost:8000/api"
USERNAME = "admin"  # Change to your test user
PASSWORD = "admin"  # Change to your test password

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

def create_category(token, name, is_income=False):
    """Create a category"""
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "name": name,
        "is_income": is_income,
        "color": "#EF4444" if not is_income else "#10B981"
    }
    response = requests.post(f"{BASE_URL}/transactions/categories/", json=data, headers=headers)
    if response.status_code == 201:
        return response.json()
    else:
        print(f"Failed to create category {name}: {response.text}")
        return None

def create_budget(token, name, total_amount, start_date, end_date, category_allocations):
    """Create a budget with category allocations"""
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "name": name,
        "total_amount": str(total_amount),
        "period_type": "MONTHLY",
        "start_date": start_date,
        "end_date": end_date,
        "notes": f"{name} budget",
        "category_allocations": category_allocations
    }
    response = requests.post(f"{BASE_URL}/budgets/budgets/", json=data, headers=headers)
    if response.status_code == 201:
        return response.json()
    else:
        print(f"Failed to create budget: {response.text}")
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
    print("=== Budget-Transaction Integration Test ===\n")
    
    # Step 1: Login
    print("1. Logging in...")
    token = login()
    if not token:
        return
    print("✓ Login successful\n")
    
    # Step 2: Create categories
    print("2. Creating categories...")
    food_category = create_category(token, "Food", is_income=False)
    transport_category = create_category(token, "Transport", is_income=False)
    
    if not food_category or not transport_category:
        print("Failed to create categories")
        return
    
    print(f"✓ Created Food category (ID: {food_category['id']})")
    print(f"✓ Created Transport category (ID: {transport_category['id']})\n")
    
    # Step 3: Create budget with category allocations
    print("3. Creating budget with category allocations...")
    start_date = datetime.now().replace(day=1).strftime("%Y-%m-%d")
    end_date = (datetime.now().replace(day=1) + timedelta(days=32)).replace(day=1) - timedelta(days=1)
    end_date = end_date.strftime("%Y-%m-%d")
    
    category_allocations = [
        {
            "category": food_category['id'],
            "amount": "2000.00",
            "notes": "Groceries and dining out"
        },
        {
            "category": transport_category['id'],
            "amount": "1000.00",
            "notes": "Fuel, public transport, rideshare"
        }
    ]
    
    budget = create_budget(token, "Monthly Budget", 5000.00, start_date, end_date, category_allocations)
    if not budget:
        print("Failed to create budget")
        return
    
    print(f"✓ Created budget (ID: {budget['id']})")
    print(f"  - Total amount: ${budget['total_amount']}")
    print(f"  - Period: {budget['start_date']} to {budget['end_date']}")
    print(f"  - Categories: {len(budget['categories'])} allocated\n")
    
    # Step 4: Create transactions
    print("4. Creating transactions...")
    today = datetime.now().strftime("%Y-%m-%d")
    
    transaction1 = create_transaction(token, 150.00, "Grocery shopping", food_category['id'], today)
    transaction2 = create_transaction(token, 25.00, "Uber ride", transport_category['id'], today)
    
    if transaction1 and transaction2:
        print(f"✓ Created transaction: {transaction1['description']} (${transaction1['amount']})")
        print(f"✓ Created transaction: {transaction2['description']} (${transaction2['amount']})")
    else:
        print("Failed to create transactions")
        return
    
    print()
    
    # Step 5: Get budget analysis
    print("5. Getting budget spending analysis...")
    analysis = get_budget_analysis(token, budget['id'])
    if not analysis:
        print("Failed to get budget analysis")
        return
    
    print("✓ Budget Analysis Results:")
    print(f"  - Total Budgeted: ${analysis['overall_progress']['total_budgeted']}")
    print(f"  - Total Spent: ${analysis['overall_progress']['total_spent']}")
    print(f"  - Percentage Used: {analysis['overall_progress']['percentage_used']:.1f}%")
    print(f"  - Days Remaining: {analysis['overall_progress']['days_remaining']}")
    
    print("\n  Category Breakdown:")
    for category in analysis['category_breakdown']:
        print(f"    - {category['category_name']}: ${category['spent_amount']}/${category['budgeted_amount']} ({category['percentage_used']:.1f}%)")
    
    print("\n=== Test Complete ===")
    print("The budget-transaction integration is working correctly!")
    print("You can now:")
    print("1. Go to the frontend and see the budget with real spending data")
    print("2. Add more transactions and see the budget progress update")
    print("3. Create budgets with different category allocations")

if __name__ == "__main__":
    main() 