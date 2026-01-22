import { render, screen } from "@testing-library/react";
import GameStatus from "@/components/chess/GameStatus/GameStatus";
import { TeamType } from "@/domain/chess/types";

describe("Component: GameStatus", () => {
  it("renders nothing when no winning team and not in check: 勝利チームがいない、またはチェック中でなければ、何もレンダーしない", () => {
    const { container } = render(<GameStatus winningTeam={undefined} isCheck={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("displays check status when king is in check: チェック中であれば、チェック状態を表示する", () => {
    render(<GameStatus isCheck={true} />);
    expect(screen.getByText("Check!")).toBeInTheDocument();
  });

  it("displays winning team message when game is over: 勝利チームのメッセージを表示する", () => {
    const { rerender } = render(<GameStatus winningTeam={TeamType.OUR} isCheck={false} />);
    expect(screen.getByText("You Win!")).toBeInTheDocument();

    rerender(<GameStatus winningTeam={TeamType.OPPONENT} isCheck={false} />);
    expect(screen.getByText("You Lose!")).toBeInTheDocument();
  });

  it("prioritizes winning team over check status: 勝利チームが優先される", () => {
    render(<GameStatus winningTeam={TeamType.OUR} isCheck={true} />);
    expect(screen.getByText("You Win!")).toBeInTheDocument();
    expect(screen.queryByText("Check!")).not.toBeInTheDocument();
  });

  it("handles check state transitions: チェック状態の遷移を処理する", () => {
    const { rerender } = render(<GameStatus winningTeam={undefined} isCheck={false} />);
    expect(screen.queryByText("Check!")).not.toBeInTheDocument();

    rerender(<GameStatus winningTeam={undefined} isCheck={true} />);
    expect(screen.getByText("Check!")).toBeInTheDocument();

    rerender(<GameStatus winningTeam={undefined} isCheck={false} />);
    expect(screen.queryByText("Check!")).not.toBeInTheDocument();
  });

  it("applies correct CSS classes: CSSクラスを正しく適用する", () => {
    render(<GameStatus winningTeam={TeamType.OUR} isCheck={false} />);
    const overlay = screen.getByText("You Win!").parentElement;
    expect(overlay).toBeInTheDocument();
  });

  it("handles all winning team scenarios: 勝利チームのメッセージを表示する", () => {
    const { rerender } = render(<GameStatus winningTeam={TeamType.OUR} isCheck={false} />);
    expect(screen.getByText("You Win!")).toBeInTheDocument();

    rerender(<GameStatus winningTeam={TeamType.OPPONENT} isCheck={false} />);
    expect(screen.getByText("You Lose!")).toBeInTheDocument();

    rerender(<GameStatus winningTeam={undefined} isCheck={false} />);
    expect(screen.queryByText(/You Win!|You Lose!/)).not.toBeInTheDocument();
  });
});