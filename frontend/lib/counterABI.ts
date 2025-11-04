export const counterABI = [
    {
      inputs: [],
      name: 'add',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'decrease',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'count',
      outputs: [{ internalType: 'int256', name: '', type: 'int256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ] as const