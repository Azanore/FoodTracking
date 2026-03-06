---
inclusion: always
---
---
inclusion: always
---

## Code Quality & Style

**Minimalism First**: Write minimal, functional code with no verbosity or defensive programming. This is non-negotiable.

**Naming Conventions**:
- Named exports preferred over default exports
- PascalCase for components and classes
- camelCase for variables and functions
- Self-explanatory names (length doesn't matter)
- File names indicate single purpose

**Code Organization**:
- Config variables at the top with comments
- Extract magic numbers into named constants
- Keep functions focused (target <20 lines)
- Remove dead code, unused imports, and orphaned files after changes
- Remove duplicate/unused functions when adding new ones

**Error Handling**:
- No silent failures or null returns
- Fail explicitly with clear error messages

## Documentation

**Comments**:
- Single comment above each function/class/complex logic describing purpose
- Inline comments for medium-to-high complexity logic only
- File header comment: purpose, related files/classes/functions, what it shouldn't include

**Logging**:
- Add logs only when absolutely necessary
- Avoid defensive logging

**Documentation Files**:
- Do not create documentation or summary files
- Share notes, change summaries, and analysis directly in chat
- Only create/update docs when explicitly requested

## Architecture & Patterns

**Consistency**:
- Follow existing coding patterns from other files
- Reuse existing patterns; don't refactor beyond targeted area
- Align folder structure, features, coding patterns, schemas, and rules

**YAGNI Principle**:
- You Aren't Gonna Need It - build only what's needed now
- Avoid over-engineering and premature optimization

**Refactoring**:
- No logic changes during refactoring, only structural improvements
- Extract repeated patterns into utilities only when judged important
- Mention refactoring opportunities after completing tasks

**Component Changes**:
- Target only the affected element, not shared/dependent components
- Prefer changing one over changing all

## Development Workflow

**Before Coding**:
- Read related files to understand context, dependencies, and patterns
- Analyze everything related to the problem
- Confirm issues exist and clarify them before implementing solutions

**During Coding**:
- Make minimal, well-thought-out changes
- Don't break existing functionality
- Reuse what's reusable when adding features
- Maintain feature independence

**After Coding**:
- Provide clear before/after differentiation for validation
- Mention what can be refactored (e.g., "X and Y can be refactored")
- Send all commands at the end as text, not mid-coding

## Critical Thinking & Challenge

**Never Accept Blindly**: Analyze, investigate, critique, and reason about every request and idea.
- Question assumptions and proposed solutions
- Evaluate against: UX simplicity, flexibility, usability, feature value, scope creep, complexity
- Propose alternatives if the request has issues
- Push back when something adds unnecessary complexity or doesn't serve users

**Priority Order** (highest to lowest):
1. **User Experience** - Simplicity, usability, intuitive flow
2. **Feature Value** - Does it solve a real problem? Is it meaningful?
3. **Scope Control** - Does it fit the vision? Is it scope creep?
4. **Implementation Complexity** - Effort vs. value ratio
5. **Flexibility** - Can it adapt to future needs without over-engineering?

**When to Push Back**:
- Feature doesn't align with core value proposition
- Adds complexity without proportional user benefit
- Creates maintenance burden for edge cases
- Better alternative exists that's simpler or more effective
- Request conflicts with established design decisions

**How to Challenge**:
- Present analysis with clear reasoning
- Offer alternatives with trade-offs
- Explain impact on UX, scope, and complexity
- Recommend the optimal path (may differ from request)

## Decision Making

**When Asked for Tasks**:
- Provide 3 suggestions with one highly recommended
- Include rationale for each option
- Clearly state which is best

**Standards**:
- Stick to benchmark standards, not perfection
- Establish non-negotiables upfront

## UI Development

**Layout Precision**:
- For fixed-size layouts, ensure pixel-perfect containers
- Total width/height of children (including padding, borders, margins) must match container dimensions

**Wireframes**:
- Use ASCII art for new pages/dialogs/popups/UI elements

## Platform-Specific

**Windows Environment**:
- Use Windows-friendly PowerShell commands
- Use `;` instead of `&&` for command chaining
- Use file tools for creation, not shell commands

## Security

- Never hardcode secrets or sensitive data
- Use environment variables or secure configuration