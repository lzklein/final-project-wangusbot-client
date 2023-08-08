"""Update relationship

Revision ID: 9f0e58cad7a2
Revises: f14c48e6d1d1
Create Date: 2023-08-08 12:17:54.098093

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9f0e58cad7a2'
down_revision = 'f14c48e6d1d1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('servercommands', schema=None) as batch_op:
        batch_op.drop_constraint('fk_servercommands_server_id_botservers', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_servercommands_discord_id_botservers'), 'botservers', ['discord_id'], ['discord_id'])
        batch_op.create_foreign_key(batch_op.f('fk_servercommands_discord_name_botservers'), 'botservers', ['discord_name'], ['discord_name'])
        batch_op.drop_column('server_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('servercommands', schema=None) as batch_op:
        batch_op.add_column(sa.Column('server_id', sa.INTEGER(), nullable=True))
        batch_op.drop_constraint(batch_op.f('fk_servercommands_discord_name_botservers'), type_='foreignkey')
        batch_op.drop_constraint(batch_op.f('fk_servercommands_discord_id_botservers'), type_='foreignkey')
        batch_op.create_foreign_key('fk_servercommands_server_id_botservers', 'botservers', ['server_id'], ['id'])

    # ### end Alembic commands ###