"""new column

Revision ID: d6b56c7f8717
Revises: 6ee3f322c44a
Create Date: 2023-08-09 11:06:32.357518

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd6b56c7f8717'
down_revision = '6ee3f322c44a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('botcommands', schema=None) as batch_op:
        batch_op.add_column(sa.Column('command_type', sa.String(), nullable=True))

    with op.batch_alter_table('servercommands', schema=None) as batch_op:
        batch_op.add_column(sa.Column('command_type', sa.String(), nullable=True))
        batch_op.create_foreign_key(batch_op.f('fk_servercommands_command_type_botcommands'), 'botcommands', ['command_type'], ['command_type'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('servercommands', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_servercommands_command_type_botcommands'), type_='foreignkey')
        batch_op.drop_column('command_type')

    with op.batch_alter_table('botcommands', schema=None) as batch_op:
        batch_op.drop_column('command_type')

    # ### end Alembic commands ###
