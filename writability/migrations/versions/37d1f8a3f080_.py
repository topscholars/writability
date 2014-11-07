"""empty message

Revision ID: 37d1f8a3f080
Revises: 308be85bb06a
Create Date: 2014-08-15 13:46:43.424730

"""

# revision identifiers, used by Alembic.
revision = '37d1f8a3f080'
down_revision = '308be85bb06a'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(u'choice_group_num_required_essays_key', 'choice_group')
    op.drop_index('choice_group_num_required_essays_key', table_name='choice_group')
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_index('choice_group_num_required_essays_key', 'choice_group', ['num_required_essays'], unique=True)
    op.create_unique_constraint(u'choice_group_num_required_essays_key', 'choice_group', ['num_required_essays'])
    ### end Alembic commands ###