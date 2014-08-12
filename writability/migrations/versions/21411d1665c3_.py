"""empty message

Revision ID: 21411d1665c3
Revises: 23bc1d99de1
Create Date: 2014-08-05 19:01:01.128213

"""

# revision identifiers, used by Alembic.
revision = '21411d1665c3'
down_revision = '23bc1d99de1'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('application_essay', sa.Column('state', sa.String(), nullable=False, server_default="new"))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('application_essay', 'state')
    ### end Alembic commands ###