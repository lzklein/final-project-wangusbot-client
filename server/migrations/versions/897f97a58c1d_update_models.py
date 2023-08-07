"""Update models

Revision ID: 897f97a58c1d
Revises: 5020c87f3d69
Create Date: 2023-08-06 03:06:16.299103

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '897f97a58c1d'
down_revision = '5020c87f3d69'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('sessionservers', schema=None) as batch_op:
        batch_op.alter_column('session_user_id',
               existing_type=sa.INTEGER(),
               type_=sa.String(),
               existing_nullable=True)
        batch_op.drop_constraint('fk_sessionservers_session_user_id_sessionusers', type_='foreignkey')
        batch_op.drop_constraint('fk_sessionservers_session_username_sessionusers', type_='foreignkey')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('sessionservers', schema=None) as batch_op:
        batch_op.create_foreign_key('fk_sessionservers_session_username_sessionusers', 'sessionusers', ['session_username'], ['user_global_name'])
        batch_op.create_foreign_key('fk_sessionservers_session_user_id_sessionusers', 'sessionusers', ['session_user_id'], ['user_id'])
        batch_op.alter_column('session_user_id',
               existing_type=sa.String(),
               type_=sa.INTEGER(),
               existing_nullable=True)

    # ### end Alembic commands ###