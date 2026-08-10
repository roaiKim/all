import { useMemo } from 'react';
import type { Choice, VariableValue } from '@shared/types/game';

interface ChoicePanelProps {
  choices: Choice[];
  variables: Record<string, VariableValue>;
  onSelect: (choiceId: string) => void;
}

/**
 * Choice panel — displays branching options for the player.
 * Automatically filters choices whose conditions are not met.
 */
export function ChoicePanel({ choices, variables, onSelect }: ChoicePanelProps) {
  // Filter choices by conditions
  const visibleChoices = useMemo(() => {
    return choices.filter((choice) => {
      if (!choice.conditions || choice.conditions.length === 0) return true;
      return choice.conditions.every((cond) => {
        const current = variables[cond.variableId];
        if (current === undefined) return false;
        switch (cond.operator) {
          case 'eq':
            return current === cond.value;
          case 'neq':
            return current !== cond.value;
          case 'gt':
            return Number(current) > Number(cond.value);
          case 'gte':
            return Number(current) >= Number(cond.value);
          case 'lt':
            return Number(current) < Number(cond.value);
          case 'lte':
            return Number(current) <= Number(cond.value);
          default:
            return false;
        }
      });
    });
  }, [choices, variables]);

  if (visibleChoices.length === 0) return null;

  return (
    <div className="player-choices">
      {visibleChoices.map((choice, index) => (
        <button
          key={choice.id}
          className="player-choice-btn"
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={() => onSelect(choice.id)}
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
}
