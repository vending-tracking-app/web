import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import {
  Container,
  Heading,
  Button,
  Flex,
  Text,
  Card,
  Grid,
  DataList,
  TextField,
} from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

import { useMachines } from '@/hooks/use-machines';
import { AdminMenu } from '../../../components/admin-menu';

export const Route = createFileRoute('/admin/machines/')({
  component: AdminMachinesPage,
});

function AdminMachinesPage() {
  const { machines } = useMachines();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredMachines = useMemo(() => {
    if (!machines) {
      return [];
    }

    if (!searchQuery.trim()) {
      return machines;
    }

    const query = searchQuery.toLowerCase();
    return machines.filter(
      (machine) =>
        machine.name.toLowerCase().includes(query) ||
        machine.location.toLowerCase().includes(query),
    );
  }, [machines, searchQuery]);

  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="4">
        {/* Header */}
        <Flex justify="between" align="center">
          <Flex align="center" gap="2">
            <AdminMenu />
            <Heading size="6">Machines</Heading>
          </Flex>

          <Button asChild>
            <Link to="/admin/machines/new">Add Machine</Link>
          </Button>
        </Flex>

        {/* Search */}
        <TextField.Root
          placeholder="Search by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>

        {/* Machines Grid */}
        <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="4">
          {filteredMachines.map((machine) => (
            <Link
              key={machine.id}
              to="/admin/machines/$id"
              params={{ id: machine.id }}
            >
              <Card>
                <Flex direction="column" gap="3">
                  <Heading size="4">{machine.name}</Heading>

                  {/* Machine Details */}
                  <DataList.Root>
                    <DataList.Item>
                      <DataList.Label>Location</DataList.Label>
                      <DataList.Value>
                        <Text>{machine.location}</Text>
                      </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.Label>Created</DataList.Label>
                      <DataList.Value>
                        {new Date(machine.createdAt).toLocaleString()}
                      </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.Label>Updated</DataList.Label>
                      <DataList.Value>
                        {new Date(machine.updatedAt).toLocaleString()}
                      </DataList.Value>
                    </DataList.Item>
                  </DataList.Root>
                </Flex>
              </Card>
            </Link>
          ))}
        </Grid>
      </Flex>
    </Container>
  );
}
