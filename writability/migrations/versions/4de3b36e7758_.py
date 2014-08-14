"""empty message

Revision ID: 4de3b36e7758
Revises: 3ad962e9cab7
Create Date: 2014-08-14 15:36:43.704624

"""

# revision identifiers, used by Alembic.
revision = '4de3b36e7758'
down_revision = '3ad962e9cab7'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('application_essay', sa.Column('onboarding_is_selected', sa.Boolean(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('application_essay', 'onboarding_is_selected')
    ### end Alembic commands ###
