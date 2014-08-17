"""empty message

Revision ID: 3c4966b36d6c
Revises: 23b51c7a7410
Create Date: 2014-08-14 14:53:10.379415

"""

# revision identifiers, used by Alembic.
revision = '3c4966b36d6c'
down_revision = '23b51c7a7410'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('onboarded', sa.Boolean(), nullable=True, default=False))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'onboarded')
    ### end Alembic commands ###
