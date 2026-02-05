import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
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

import { fetchMachines } from '../../../api/machines';
import { ExpeditorMenu } from '../../../components/expeditor-menu';

export const Route = createFileRoute('/expeditor/machines/')({
  component: ExpeditorMachinesPage,
});

function ExpeditorMachinesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: machines } = useQuery({
    queryKey: ['machines'],
    queryFn: fetchMachines,
  });

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
        <Flex align="center" gap="2">
          <ExpeditorMenu />
          <Heading size="6">Machines</Heading>
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
            <Card key={machine.id}>
              <Flex direction="column" gap="3">
                {/* Machine Header */}
                <Flex justify="between" align="start">
                  <Heading size="4">{machine.name}</Heading>
                  <Button asChild size="2" variant="soft">
                    <Link
                      to="/expeditor/machines/$id/close-shift"
                      params={{ id: machine.id }}
                    >
                      Close Shift
                    </Link>
                  </Button>
                </Flex>

                {/* Machine Details */}
                <DataList.Root>
                  <DataList.Item>
                    <DataList.Label>Location</DataList.Label>
                    <DataList.Value>
                      <Text>{machine.location}</Text>
                    </DataList.Value>
                  </DataList.Item>
                </DataList.Root>
              </Flex>
            </Card>
          ))}
        </Grid>
      </Flex>
    </Container>
  );
}
