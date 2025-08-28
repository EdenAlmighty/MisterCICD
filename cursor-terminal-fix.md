# Fix Cursor Terminal Hanging with Complex Prompts (Powerlevel10k, etc.)

## 🐛 The Problem

Cursor's integrated terminal can hang after running commands, especially in Agent Mode, requiring you to click to pop the terminal out to continue. This commonly happens with complex shell prompts like Powerlevel10k that use:

- Complex glyphs and symbols
- Async segments
- Multiple prompt lines
- Custom prompt functions

## 🔍 Root Cause

Cursor's terminal detection mechanism struggles with complex prompts that don't follow standard completion patterns. The issue is particularly common with:

- **Powerlevel10k** (most common culprit)
- **Starship** with complex configurations
- **Oh My Posh** with elaborate themes
- Custom prompts with async segments

## 🛠️ Solution: Conditional Prompt Configuration

### For PowerShell Users (Windows)

Create or edit your PowerShell profile at `$PROFILE` (usually `C:\Users\<username>\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`):

```powershell
# Detect if running inside Cursor/VS Code
if ($env:TERM_PROGRAM -eq "vscode") {
    # Use a minimal prompt for Cursor to prevent hanging
    function prompt {
        $currentPath = (Get-Location).Path
        $user = $env:USERNAME
        $computer = $env:COMPUTERNAME
        return "$user@$computer`:$currentPath> "
    }
} else {
    # Use your normal prompt configuration here
    # For example, if you have Oh My Posh:
    # oh-my-posh init pwsh --config ~/.poshthemes/your-theme.omp.json | Invoke-Expression
}
```

### For Zsh + Powerlevel10k Users

Add this to your `~/.zshrc`:

```bash
# Detect if running inside Cursor/VS Code
if [[ "$TERM_PROGRAM" == "vscode" ]]; then
  # Disable Powerlevel10k for Cursor to prevent hanging
  ZSH_THEME=""
  # Use a minimal, clean prompt
  PROMPT='%n@%m:%~%# '
  RPROMPT=''
else
  # Use Powerlevel10k everywhere else
  ZSH_THEME="powerlevel10k/powerlevel10k"
  # Load Powerlevel10k configuration
  [[ -f ~/.p10k.zsh ]] && source ~/.p10k.zsh
fi

# Load Oh My Zsh after theme configuration
source $ZSH/oh-my-zsh.sh
```

### For Bash Users

Add this to your `~/.bashrc`:

```bash
# Detect if running inside Cursor/VS Code
if [[ "$TERM_PROGRAM" == "vscode" ]]; then
  # Use a minimal prompt for Cursor
  PS1='\u@\h:\w\$ '
else
  # Use your normal prompt configuration
  # Add your existing prompt setup here
fi
```

### For Fish Shell Users

Add this to your `~/.config/fish/config.fish`:

```fish
# Detect if running inside Cursor/VS Code
if test "$TERM_PROGRAM" = "vscode"
    # Use a minimal prompt for Cursor
    function fish_prompt
        echo -n (whoami)@(hostname):(pwd)'$ '
    end
else
    # Use your normal prompt configuration
    # Add your existing prompt setup here
end
```

## 🎨 Enhanced Minimal Prompts

### PowerShell with Git Info

```powershell
if ($env:TERM_PROGRAM -eq "vscode") {
    function prompt {
        $currentPath = (Get-Location).Path
        $user = $env:USERNAME
        $computer = $env:COMPUTERNAME

        # Get git branch if in a git repository
        $gitBranch = ""
        if (Test-Path ".git") {
            $gitBranch = git branch --show-current 2>$null
            if ($gitBranch) {
                $gitBranch = " ($gitBranch)"
            }
        }

        return "$user@$computer`:$currentPath$gitBranch> "
    }
}
```

### Zsh with Git Info

```bash
if [[ "$TERM_PROGRAM" == "vscode" ]]; then
  # Enhanced minimal prompt with git branch
  autoload -Uz vcs_info
  precmd() { vcs_info }
  zstyle ':vcs_info:git:*' formats '(%b)'
  PROMPT='%n@%m:%~${vcs_info_msg_0_}%# '
  RPROMPT=''
fi
```

### Bash with Git Info

```bash
if [[ "$TERM_PROGRAM" == "vscode" ]]; then
  # Enhanced minimal prompt with git branch
  PS1='\u@\h:\w$(git branch 2>/dev/null | grep -e "^*" | sed "s/^* \(.*\)/ (\1)/")$ '
fi
```

## 🔧 Alternative Solutions

### Option 1: Disable Async Segments Only

If you want to keep some Powerlevel10k features:

```bash
if [[ "$TERM_PROGRAM" == "vscode" ]]; then
  ZSH_THEME="powerlevel10k/powerlevel10k"
  # Disable async segments that cause hanging
  POWERLEVEL9K_DISABLE_HOT_RELOAD=true
  POWERLEVEL9K_INSTANT_PROMPT=quiet
  # Disable problematic segments
  POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(dir vcs)
  POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(status)
fi
```

### Option 2: Use Starship with Minimal Config

```bash
if [[ "$TERM_PROGRAM" == "vscode" ]]; then
  # Use minimal Starship config for Cursor
  export STARSHIP_CONFIG="$HOME/.config/starship/cursor.toml"
else
  # Use full Starship config elsewhere
  export STARSHIP_CONFIG="$HOME/.config/starship/starship.toml"
fi
```

### Option 3: PowerShell with Oh My Posh (Conditional)

```powershell
if ($env:TERM_PROGRAM -eq "vscode") {
    # Use minimal prompt for Cursor
    function prompt {
        $currentPath = (Get-Location).Path
        $user = $env:USERNAME
        $computer = $env:COMPUTERNAME
        return "$user@$computer`:$currentPath> "
    }
} else {
    # Use Oh My Posh in other terminals
    oh-my-posh init pwsh --config ~/.poshthemes/your-theme.omp.json | Invoke-Expression
}
```

## ✅ Verification Steps

1. **Restart Cursor** completely (not just the terminal)
2. **Test command completion**:
   ```bash
   sleep 5 && echo "Command completed"
   ```
3. **Test long-running commands**:
   ```bash
   npm install
   ```
4. **Test Agent Mode** commands

## 🚀 Additional Tips

### Environment Variable Detection

You can also detect Cursor specifically:

```bash
if [[ "$TERM_PROGRAM" == "vscode" ]] || [[ "$VSCODE_PID" ]]; then
  # Cursor-specific configuration
fi
```

### Debugging

If issues persist, check your terminal type:

```bash
echo $TERM_PROGRAM
echo $TERM
```

### Performance Monitoring

Monitor terminal performance:

```bash
# Time how long your prompt takes to render
time zsh -i -c exit
```

## 🎯 Expected Results

After implementing this fix:

- ✅ No more terminal hanging in Cursor
- ✅ Proper command completion detection
- ✅ Agent Mode works smoothly
- ✅ Your beautiful prompt still works in other terminals
- ✅ No need to click or pop out terminal

## 🔄 Troubleshooting

If the fix doesn't work:

1. **Clear terminal cache**: Close all terminals and restart Cursor
2. **Check shell configuration**: Ensure your shell is properly configured
3. **Verify environment variables**: Make sure `$TERM_PROGRAM` is set correctly
4. **Try different detection methods**: Use `$VSCODE_PID` or `$TERM` as alternatives

---

_This solution allows you to keep your beautiful Powerlevel10k prompt in other terminals while ensuring Cursor's terminal works reliably._
