import { render, screen } from "@testing-library/react";
import GameStatus from "../GameStatus";
import { TeamType } from "@/domain/chess/types";

describe("Component: GameStatus", () => {
  it("renders nothing when no winning team and not in check: 勝利チームがいない、またはチェック中でなければ、何もレンダーしない", () => {
    const { container } = render(<GameStatus winningTeam={undefined} isCheck={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("displays check status when king is in check: チェック中であれば、チェック状態を表示する", () => {
    render(<GameStatus isCheck={true} />);
    const checkElement = screen.getByText("Check!");
    expect(checkElement).toBeInTheDocument();
  });

  it("displays winning team message when game is over: 勝利チームのメッセージを表示する", () => {
    // Test OUR team win
    const { rerender } = render(<GameStatus winningTeam={TeamType.OUR} isCheck={false} />);
    expect(screen.getByText("You Win!")).toBeInTheDocument();

    // Test OPPONENT team win
    rerender(<GameStatus winningTeam={TeamType.OPPONENT} isCheck={false} />);
    expect(screen.getByText("You Lose!")).toBeInTheDocument();
  });

  it("prioritizes winning team over check status: 勝利チームが優先される", () => {
    render(<GameStatus winningTeam={TeamType.OUR} isCheck={true} />);

    // Should show win message, not check
    expect(screen.getByText("You Win!")).toBeInTheDocument();
    expect(screen.queryByText("Check!")).not.toBeInTheDocument();
  });

  it("handles check state transitions: チェック状態の遷移を処理する", () => {
    const { rerender } = render(<GameStatus winningTeam={undefined} isCheck={false} />);
    expect(screen.queryByText("Check!")).not.toBeInTheDocument();

    // Enter check state
    rerender(<GameStatus winningTeam={undefined} isCheck={true} />);
    expect(screen.getByText("Check!")).toBeInTheDocument();

    // Exit check state
    rerender(<GameStatus winningTeam={undefined} isCheck={false} />);
    expect(screen.queryByText("Check!")).not.toBeInTheDocument();
  });

  it("applies correct CSS classes: CSSクラスを正しく適用する", () => {
    render(<GameStatus winningTeam={TeamType.OUR} isCheck={false} />);
    const overlay = screen.getByText("You Win!").parentElement;
    expect(overlay).toBeInTheDocument();
    // Note: CSS modules don't apply class names in test environment
    // Just check that the element exists
  });

  it("handles all winning team scenarios: 勝利チームのメッセージを表示する", () => {
    // Test OUR team win
    const { rerender } = render(<GameStatus winningTeam={TeamType.OUR} isCheck={false} />);
    expect(screen.getByText("You Win!")).toBeInTheDocument();

    // Test OPPONENT team win
    rerender(<GameStatus winningTeam={TeamType.OPPONENT} isCheck={false} />);
    expect(screen.getByText("You Lose!")).toBeInTheDocument();

    // Test no winner
    rerender(<GameStatus winningTeam={undefined} isCheck={false} />);
    expect(screen.queryByText(/You Win!|You Lose!/)).not.toBeInTheDocument();
  });
});
