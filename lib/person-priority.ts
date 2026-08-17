type MembershipPriority = {
  order: number;
  category: {
    order: number;
  };
};

type PersonWithMembershipPriorities = {
  name: string;
  memberships: MembershipPriority[];
};

const LAST_PRIORITY = Number.MAX_SAFE_INTEGER;

function getHighestMembershipPriority(
  memberships: MembershipPriority[],
): [categoryOrder: number, membershipOrder: number] {
  return memberships.reduce<[number, number]>(
    (highestPriority, membership) => {
      const membershipPriority: [number, number] = [
        membership.category.order,
        membership.order,
      ];

      if (
        membershipPriority[0] < highestPriority[0] ||
        (membershipPriority[0] === highestPriority[0] &&
          membershipPriority[1] < highestPriority[1])
      ) {
        return membershipPriority;
      }

      return highestPriority;
    },
    [LAST_PRIORITY, LAST_PRIORITY],
  );
}

export function sortPeopleByMembershipPriority<
  TPerson extends PersonWithMembershipPriorities,
>(people: TPerson[]) {
  return [...people].sort((firstPerson, secondPerson) => {
    const firstPriority = getHighestMembershipPriority(
      firstPerson.memberships,
    );
    const secondPriority = getHighestMembershipPriority(
      secondPerson.memberships,
    );

    return (
      firstPriority[0] - secondPriority[0] ||
      firstPriority[1] - secondPriority[1] ||
      firstPerson.name.localeCompare(secondPerson.name, "tr-TR")
    );
  });
}
