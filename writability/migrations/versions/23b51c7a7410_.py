"""empty message

Revision ID: 23b51c7a7410
Revises: 2b64dd55b17a
Create Date: 2014-08-14 14:46:48.990156

"""

# revision identifiers, used by Alembic.
revision = '23b51c7a7410'
down_revision = '2b64dd55b17a'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('university', sa.Column('use_common_app', sa.Boolean(), nullable=True, default=False))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('university', 'use_common_app')
    ### end Alembic commands ###