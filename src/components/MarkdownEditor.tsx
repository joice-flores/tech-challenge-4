import { useState } from 'react';
import { NativeSyntheticEvent, TextInputSelectionChangeEventData } from 'react-native';
import {
  Wrapper,
  Toolbar,
  ToolBtn,
  ToolLabel,
  ToolLabelBold,
  ToolLabelItalic,
  ToolDivider,
  Editor,
} from './MarkdownEditor.styles';

interface Selection {
  start: number;
  end: number;
}

interface Props {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
}

function inlineFormat(value: string, sel: Selection, prefix: string, suffix: string) {
  const hasSelection = sel.start !== sel.end;
  const selected = hasSelection ? value.slice(sel.start, sel.end) : 'texto';
  const text =
    value.slice(0, sel.start) +
    prefix +
    selected +
    suffix +
    value.slice(hasSelection ? sel.end : sel.start);
  const cursor = sel.start + prefix.length + selected.length + suffix.length;
  return { text, cursor };
}

function blockFormat(value: string, sel: Selection, marker: string) {
  const lineStart = value.lastIndexOf('\n', sel.start - 1) + 1;
  const text = value.slice(0, lineStart) + marker + value.slice(lineStart);
  return { text, cursor: lineStart + marker.length };
}

function insertText(value: string, sel: Selection, snippet: string) {
  const text = value.slice(0, sel.start) + snippet + value.slice(sel.start);
  return { text, cursor: sel.start + snippet.length };
}

export function MarkdownEditor({ value, onChange, placeholder, editable = true }: Props) {
  const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 });
  const [nextSelection, setNextSelection] = useState<Selection | undefined>(undefined);

  function apply(result: { text: string; cursor: number }) {
    onChange(result.text);
    const pos = { start: result.cursor, end: result.cursor };
    setNextSelection(pos);
    setTimeout(() => setNextSelection(undefined), 100);
  }

  return (
    <Wrapper>
      <Toolbar>
        <ToolBtn
          onPress={() => apply(inlineFormat(value, selection, '**', '**'))}
          activeOpacity={0.6}
        >
          <ToolLabelBold>B</ToolLabelBold>
        </ToolBtn>

        <ToolBtn
          onPress={() => apply(inlineFormat(value, selection, '_', '_'))}
          activeOpacity={0.6}
        >
          <ToolLabelItalic>I</ToolLabelItalic>
        </ToolBtn>

        <ToolBtn onPress={() => apply(blockFormat(value, selection, '# '))} activeOpacity={0.6}>
          <ToolLabel>H1</ToolLabel>
        </ToolBtn>

        <ToolDivider />

        <ToolBtn onPress={() => apply(blockFormat(value, selection, '> '))} activeOpacity={0.6}>
          <ToolLabel>{'"'}</ToolLabel>
        </ToolBtn>

        <ToolBtn onPress={() => apply(blockFormat(value, selection, '- '))} activeOpacity={0.6}>
          <ToolLabel>—</ToolLabel>
        </ToolBtn>

        <ToolBtn onPress={() => apply(blockFormat(value, selection, '- [ ] '))} activeOpacity={0.6}>
          <ToolLabel>[ ]</ToolLabel>
        </ToolBtn>

        <ToolDivider />

        <ToolBtn onPress={() => apply(insertText(value, selection, '\n---\n'))} activeOpacity={0.6}>
          <ToolLabel>HR</ToolLabel>
        </ToolBtn>
      </Toolbar>

      <Editor
        value={value}
        onChangeText={onChange}
        onSelectionChange={(e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) =>
          setSelection(e.nativeEvent.selection)
        }
        selection={nextSelection}
        placeholder={placeholder}
        placeholderTextColor="#555"
        editable={editable}
        multiline
        autoCorrect={false}
        autoCapitalize="none"
      />
    </Wrapper>
  );
}
