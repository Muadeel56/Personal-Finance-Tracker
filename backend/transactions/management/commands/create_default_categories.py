from django.core.management.base import BaseCommand
from accounts.models import User
from transactions.models import Category

class Command(BaseCommand):
    help = 'Create default categories for all users or a specific user'

    def add_arguments(self, parser):
        parser.add_argument(
            '--user',
            type=str,
            help='Email of specific user to create categories for'
        )

    def handle(self, *args, **options):
        default_categories = [
            # Income Categories
            {
                'name': 'Salary',
                'description': 'Regular employment income',
                'icon': '💰',
                'color': '#10B981',
                'is_income': True
            },
            {
                'name': 'Freelance',
                'description': 'Freelance or contract work',
                'icon': '💼',
                'color': '#84CC16',
                'is_income': True
            },
            {
                'name': 'Investment',
                'description': 'Investment returns and dividends',
                'icon': '📈',
                'color': '#06B6D4',
                'is_income': True
            },
            {
                'name': 'Business',
                'description': 'Business income',
                'icon': '🏢',
                'color': '#8B5CF6',
                'is_income': True
            },
            {
                'name': 'Other Income',
                'description': 'Other sources of income',
                'icon': '💵',
                'color': '#F59E0B',
                'is_income': True
            },
            
            # Expense Categories
            {
                'name': 'Food & Dining',
                'description': 'Groceries, restaurants, and dining out',
                'icon': '🍔',
                'color': '#EF4444',
                'is_income': False
            },
            {
                'name': 'Transportation',
                'description': 'Gas, public transport, car maintenance',
                'icon': '🚗',
                'color': '#3B82F6',
                'is_income': False
            },
            {
                'name': 'Housing',
                'description': 'Rent, mortgage, utilities',
                'icon': '🏠',
                'color': '#8B5CF6',
                'is_income': False
            },
            {
                'name': 'Healthcare',
                'description': 'Medical expenses, insurance, prescriptions',
                'icon': '💊',
                'color': '#EC4899',
                'is_income': False
            },
            {
                'name': 'Entertainment',
                'description': 'Movies, games, hobbies, subscriptions',
                'icon': '🎬',
                'color': '#F97316',
                'is_income': False
            },
            {
                'name': 'Shopping',
                'description': 'Clothing, electronics, personal items',
                'icon': '🛍️',
                'color': '#6366F1',
                'is_income': False
            },
            {
                'name': 'Travel',
                'description': 'Vacations, business trips, travel expenses',
                'icon': '✈️',
                'color': '#06B6D4',
                'is_income': False
            },
            {
                'name': 'Education',
                'description': 'Tuition, books, courses, training',
                'icon': '🎓',
                'color': '#84CC16',
                'is_income': False
            },
            {
                'name': 'Utilities',
                'description': 'Electricity, water, internet, phone',
                'icon': '⚡',
                'color': '#F59E0B',
                'is_income': False
            },
            {
                'name': 'Insurance',
                'description': 'Health, auto, home, life insurance',
                'icon': '🛡️',
                'color': '#10B981',
                'is_income': False
            },
            {
                'name': 'Taxes',
                'description': 'Income tax, property tax, other taxes',
                'icon': '📋',
                'color': '#EF4444',
                'is_income': False
            },
            {
                'name': 'Debt Payment',
                'description': 'Credit cards, loans, debt repayment',
                'icon': '💳',
                'color': '#8B5CF6',
                'is_income': False
            },
            {
                'name': 'Gifts & Donations',
                'description': 'Charitable donations, gifts',
                'icon': '🎁',
                'color': '#EC4899',
                'is_income': False
            },
            {
                'name': 'Personal Care',
                'description': 'Haircuts, spa, personal hygiene',
                'icon': '💅',
                'color': '#F97316',
                'is_income': False
            },
            {
                'name': 'Other Expenses',
                'description': 'Miscellaneous expenses',
                'icon': '💸',
                'color': '#6B7280',
                'is_income': False
            }
        ]

        if options['user']:
            try:
                user = User.objects.get(email=options['user'])
                users = [user]
                self.stdout.write(f'Creating default categories for user: {user.email}')
            except User.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'User with email {options["user"]} does not exist')
                )
                return
        else:
            users = User.objects.filter(is_active=True)
            self.stdout.write(f'Creating default categories for {users.count()} users')

        created_count = 0
        for user in users:
            for category_data in default_categories:
                # Check if category already exists for this user
                if not Category.objects.filter(user=user, name=category_data['name']).exists():
                    Category.objects.create(
                        user=user,
                        **category_data
                    )
                    created_count += 1

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} default categories')
        ) 