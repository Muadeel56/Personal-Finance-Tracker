#!/usr/bin/env python3
"""
Debug script to test budget analysis with user's actual data
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

def test_budget_analysis(token, budget_id):
    """Test budget spending analysis"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/budgets/budgets/{budget_id}/spending_analysis/", headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to get budget analysis: {response.text}")
        return None

def main():
    print("=== Debug Budget Analysis ===\n")
    
    # Login
    token = login()
    if not token:
        return
    
    # Test Food & Dining budget (ID: 3)
    print("Testing Food & Dining budget (ID: 3)...")
    analysis = test_budget_analysis(token, 3)
    
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

if __name__ == "__main__":
    main() 