"""relationship

Revision ID: 6ee3f322c44a
Revises: 9f0e58cad7a2
Create Date: 2023-08-08 15:50:20.487507

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6ee3f322c44a'
down_revision = '9f0e58cad7a2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('sessionservers', schema=None) as batch_op:
        batch_op.alter_column('session_user_id',
               existing_type=sa.VARCHAR(),
               type_=sa.Integer(),
               existing_nullable=True)
        batch_op.drop_constraint('fk_sessionservers_session_id_sessionusers', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_sessionservers_session_user_id_sessionusers'), 'sessionusers', ['session_user_id'], ['user_id'])
        batch_op.drop_column('session_id')
        batch_op.drop_column('session_username')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('sessionservers', schema=None) as batch_op:
        batch_op.add_column(sa.Column('session_username', sa.VARCHAR(), nullable=True))
        batch_op.add_column(sa.Column('session_id', sa.INTEGER(), nullable=True))
        batch_op.drop_constraint(batch_op.f('fk_sessionservers_session_user_id_sessionusers'), type_='foreignkey')
        batch_op.create_foreign_key('fk_sessionservers_session_id_sessionusers', 'sessionusers', ['session_id'], ['id'])
        batch_op.alter_column('session_user_id',
               existing_type=sa.Integer(),
               type_=sa.VARCHAR(),
               existing_nullable=True)

    # ### end Alembic commands ###